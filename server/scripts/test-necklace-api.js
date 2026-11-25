async function testNecklaceApi() {
  try {
    const listRes = await fetch('http://localhost:5055/api/products?category=necklace');
    const necklaces = await listRes.json();
    console.log(`Fetched ${necklaces.length} necklaces from /api/products?category=necklace`);
    console.log('Sample necklace from list:');
    console.log(necklaces[0]);

    // Test a specific product detail: A26
    const a26Res = await fetch('http://localhost:5055/api/products/a26');
    const a26 = await a26Res.json();
    console.log('\nDetail for A26:');
    console.log('Name:', a26.name);
    console.log('Images count:', a26.images ? a26.images.length : 0);
    console.log('Images:', a26.images);

    // Test A149
    const a149Res = await fetch('http://localhost:5055/api/products/a149');
    const a149 = await a149Res.json();
    console.log('\nDetail for A149:');
    console.log('Name:', a149.name);
    console.log('Images count:', a149.images ? a149.images.length : 0);
    console.log('Images:', a149.images);
  } catch (err) {
    console.error('API test failed:', err);
  }
}

testNecklaceApi();
