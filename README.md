# Tur Boshqaruv — Frontend

Oddiy HTML/CSS/JS, build kerak emas.

## Joylash (Netlify, eng oson)
1. `config.js` ni oching va `SIZNING-NOM` o'rniga Render backend manzilini yozing.
2. app.netlify.com/drop ga shu papkani (yoki zip'ni ochib, ichidagi fayllarni) tashlang.
3. Netlify bergan manzilni (masalan https://tur-boshqaruv.netlify.app) nusxalang.
4. Render → servis → Environment → `CORS_ORIGINS` = shu manzil (oxirida `/` yo'q) → Save.
5. Saytni oching, username `superadmin` va Render'dagi `FIRST_SUPERADMIN_PASSWORD` bilan kiring.

Boshqa variantlar: Vercel, Cloudflare Pages, GitHub Pages yoki `docker build -t web . && docker run -p 3000:80 web`.
Render bepul tarifida server 15 daqiqa so'rovsiz uxlaydi, birinchi kirish 30-60 soniya kutishi mumkin.
"# crm-fronetend-neew" 
