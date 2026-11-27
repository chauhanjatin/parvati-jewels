const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { prisma, withDbRetry, warmupDatabase, checkDbHealth } = require('./lib/prisma');
const { verifySmtpOnStartup, sendInquiryEmails } = require('./lib/inquiryMail');
const { warmupCache, getCategories, getProducts, getProductBySlug, invalidateCache } = require('./lib/catalogCache');

const app = express();

app.use(cors());
app.use(express.json());

// Database & Server Health Check endpoint
app.get('/api/health', async (req, res) => {
  const dbHealth = await checkDbHealth();
  const isHealthy = dbHealth.status === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbHealth,
  });
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.setHeader('X-Cache', 'HIT');
    res.json(categories);
  } catch (error) {
    console.error('[API /api/categories] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, subCategory } = req.query;
    const products = await getProducts({ category, subCategory });
    res.setHeader('X-Cache', 'HIT');
    res.json(products);
  } catch (error) {
    console.error('[API /api/products] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.setHeader('X-Cache', 'HIT');
    res.json(product);
  } catch (error) {
    console.error(`[API /api/products/${req.params.slug}] Error:`, error.message);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

app.post('/api/cache/refresh', async (req, res) => {
  try {
    await invalidateCache();
    res.json({ message: 'Catalog cache refreshed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { type, name, email, phone, metal, categories, message, productId } = req.body;

    const inquiry = await withDbRetry(() =>
      prisma.inquiry.create({
        data: {
          type,
          name,
          email,
          phone,
          metal,
          categories: categories ? JSON.stringify(categories) : null,
          message,
          productId
        }
      })
    );

    let productData = null;
    if (productId) {
      productData = await withDbRetry(() =>
        prisma.product.findUnique({
          where: { id: productId },
          include: {
            category: true,
            images: { where: { isPrimary: true }, take: 1 },
            variants: true
          }
        })
      );
    }

    const mailResult = await sendInquiryEmails({
      type,
      name,
      email,
      phone,
      metal,
      categories,
      message,
      productData,
    });

    res.status(201).json({
      ...inquiry,
      emailSent: mailResult.sent,
      ...(mailResult.error ? { emailError: mailResult.error } : {}),
    });
  } catch (error) {
    console.error('[API /api/inquiries] Error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

const PORT = process.env.PORT || 5055;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    if (typeof verifySmtpOnStartup === 'function') verifySmtpOnStartup();
    if (typeof warmupDatabase === 'function') await warmupDatabase();
    await warmupCache();
  });
}

module.exports = app;
