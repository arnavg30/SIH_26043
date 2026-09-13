const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const textAvatar = `<div className="w-12 h-12 rounded-full flex-shrink-0 bg-teal-900/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-teal-400 text-center leading-tight">Mitra<br/>Sahayak</span>
          </div>`;

const imgAvatar = `<img src="/mitra.png" alt="Mitra Sahayak" className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2 border-teal-500/30" />`;

code = code.replace(textAvatar, imgAvatar);

fs.writeFileSync('src/App.tsx', code);
console.log("Replaced text avatar with Mitra image.");
