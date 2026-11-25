async function testApi() {
  try {
    const listRes = await fetch('http://localhost:5055/api/products?category=rings');
    const rings = await listRes.json();
    console.log(`Fetched ${rings.length} rings from /api/products?category=rings`);
    console.log('Sample ring from list:');
    console.log(rings[0]);

    // Test a specific product detail
    const detailRes = await fetch('http://localhost:5055/api/products/pjr-506-marquise');
    const detail = await detailRes.json();
    console.log('\nDetail for pjr-506-marquise:');
    console.log('Name:', detail.name);
    console.log('Images:', detail.images);

    // Test A145
    const a145Res = await fetch('http://localhost:5055/api/products/a145');
    const a145 = await a145Res.json();
    console.log('\nDetail for a145:');
    console.log('Name:', a145.name);
    console.log('Images:', a145.images);
  } catch (err) {
    console.error('API test failed:', err);
  }
}

testApi();
