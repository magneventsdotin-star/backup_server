const fs = require('fs');
const files = [
  "c:/Users/avani/Desktop/client_1/user_dashboard1/app/services/page.jsx",
  "c:/Users/avani/Desktop/client_1/user_dashboard1/app/components/services/VideoGallery.jsx",
  "c:/Users/avani/Desktop/client_1/user_dashboard1/app/components/services/ReelsSection.jsx",
  "c:/Users/avani/Desktop/client_1/user_dashboard1/app/artist/[id]/page.jsx",
  "c:/Users/avani/Desktop/client_1/admin_dahsboard/src/app/share/[artistId]/page.tsx",
  "c:/Users/avani/Desktop/client_1/admin_dahsboard/src/app/dashboard/service-videos/page.tsx",
  "c:/Users/avani/Desktop/client_1/admin_dahsboard/src/app/dashboard/page.tsx",
  "c:/Users/avani/Desktop/client_1/admin_dahsboard/src/app/dashboard/browse/page.tsx"
];

let replacedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Try matching both variations with and without escaped ampersand
  content = content.replace(
    /const regExp = \/\^\.\*\(youtu\.be\\\/\|v\\\/\|u\\\/\\w\\\/\|embed\\\/\|watch\\\?v=\|\\\&v=\)\(\[\^#\\\&\\\?\]\*\)\.\*\//g,
    'const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|\\&v=|shorts\\/)([^#\\&\\?]*).*/'
  );
  
  content = content.replace(
    /const regExp = \/\^\.\*\(youtu\.be\\\/\|v\\\/\|u\\\/\\w\\\/\|embed\\\/\|watch\\\?v=\|&v=\)\(\[\^#&\\?\]\*\)\.\*\//g,
    'const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|\\&v=|shorts\\/)([^#\\&\\?]*).*/'
  );

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    replacedCount++;
  } else {
    console.log(`Failed to update ${file}`);
  }
}
console.log(`Total replaced: ${replacedCount}`);
