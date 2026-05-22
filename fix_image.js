const fs = require('fs');

const currentData = JSON.parse(fs.readFileSync('./src/lib/data.json', 'utf8'));

const index = currentData.findIndex(a => a.id === '1');
if (index !== -1) {
  // Replace the image tag in the content with the new image
  const content = currentData[index].content;
  currentData[index].content = content.replace(
    /<img[^>]+>/i, 
    '<img src="/uploads/pajang_tokoh.png" width="313" height="391" style="display: block; margin-left: auto; margin-right: auto; vertical-align: middle; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">'
  );
  fs.writeFileSync('./src/lib/data.json', JSON.stringify(currentData, null, 2), 'utf8');
  console.log('Fixed image for Joko Tingkir');
} else {
  console.log('Article ID 1 not found');
}
