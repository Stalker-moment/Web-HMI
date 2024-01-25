const express = require("express");
const path = require("path");
const fs = require("fs");
let reload = require("reload");
const moment = require('moment-timezone')


const app = express();
const port = 4000;

const force = false
const pathfolder = "./Parts"

const imageDir = path.join(__dirname, pathfolder);

app.use(express.static(imageDir));

app.get("/", (req, res) => {
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .send("Terjadi kesalahan dalam membaca direktori gambar.");
    }

    const imageLinks = files
      .filter((file) => file.endsWith(".png") || file.endsWith(".jpg"))
      .map((file) => `<a href="/image/${file}/0/0" target="_blank">${file}</a>`);

    const html = `
      <html>
        <head>
          <title>Daftar Gambar Untuk MES</title>
        </head>
        <body>
          <h1>Daftar Gambar Untuk MES 4</h1>
          ${imageLinks.join("<br>")}
        </body>
      </html>
    `;

    res.send(html);
  });
});

app.get('/display', (req, res) => {
  fs.readdir(pathfolder, (err, files) => {
    if (err) {
      return res.status(500).send('Terjadi kesalahan dalam membaca direktori gambar.');
    }

    const imageLinks = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
                           .map(file => {
                             const title = file.split('.')[0];
                             return `
                               <div class="image-card">
                                 <h3>${title}</h3>
                                 <a href="/image/${file}/0/0" target="_blank">
                                   <img src="/${file}" class="centered-image">
                                 </a>
                               </div>`;
                           });

    const html = `
      <html>
        <head>
          <title>Daftar Gambar</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: -100%;
              margin: 0;
            }
            .image-card {
              margin: 10px;
              text-align: center;
            }
            .centered-image {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <h1>Daftar Gambar</h1>
          <h2 id="currentTime"></h2>
          <div class="image-container">
            ${imageLinks.join('\n')}
          </div>
          <script>
          function updateClock() {
            const currentTimeElement = document.getElementById('currentTime');
            const now = new Date();
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
            const dayOfWeek = days[now.getDay()];
            const dayOfMonth = now.getDate();
            const month = months[now.getMonth()];
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
    
            const formattedTime = \`\${dayOfWeek} - \${dayOfMonth} \${month} - \${hours}:\${minutes}:\${seconds}\`;
            currentTimeElement.innerText = formattedTime;
          }
    
          setInterval(updateClock, 1000);
        </script>
        </body>
      </html>
    `;

    res.send(html);
  });
});

app.get("/realtime", (req, res) => {
  const imageHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Waktu</title>
    <!-- Styles dan CSS lainnya -->
  </head>
  <body>
    <div class="canvas">
      <div class="card">
        <h1 class="name">Waktu Realtime :</h3>
        <h2 id="currentTime"></h2>
      </div>
    </div>

    <script>
      function updateClock() {
        const currentTimeElement = document.getElementById('currentTime');
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        const dayOfWeek = days[now.getDay()];
        const dayOfMonth = now.getDate();
        const month = months[now.getMonth()];
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const formattedTime = \`\${dayOfWeek} - \${dayOfMonth} \${month} - \${hours}:\${minutes}:\${seconds}\`;
        currentTimeElement.innerText = formattedTime;
      }

      setInterval(updateClock, 1000);
    </script>
  </body>
  </html>`

  res.send(imageHtml);
})

app.get("/image/:imageName/:txt/:value", (req, res) => {
  const imageName = req.params.imageName;
  const imageTitle = path.parse(imageName).name;
  try {
    const txt = req.params.txt;
    const value = req.params.value;

    if (txt == "1") {
      var imageHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${value}</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
          margin: 0;

        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
        .name{
          font-size: 25px
        }
        .canvas {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%; 
        }
        .card {
          height: 100%;
          width: 100%; 
          padding: 20px;
          border-radius: 20px;
          background: #f0f0f0;
          box-shadow: 10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff;
          transition: all 0.3s ease-in-out;
          margin-top: 0;
          margin-bottom: 40px;
          text-align: center;
        }
        .produk-mes{
          border-radius: 50%;
          width: 50%;
          height: 50%;
          z-index: -100;
          position: relative;
          bottom: 50px
        }
      </style>
    </head>
    <body>
      <div class="canvas">
        <div class="card">
        
          <h3 class="name">${value}</h3>
        </div>
        <img class="produk-mes" src="/${imageName}" alt="${value}">
      </div>
    </body>
    </html>
    
    `;

    } else {
      if(force == true){
        var imageHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${value}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              width: 100%;
              margin: 0;
    
            }
            img {
              max-width: 100%;
              max-height: 100%;
            }
            .name{
              font-size: 25px
            }
            .canvas {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 350px;
            
            }
            .card {
              width: 300px;
              height: 100px;
              padding: 20px;
              border-radius: 20px;
              background: #f0f0f0;
              box-shadow: 10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff;
              transition: all 0.3s ease-in-out;
              margin-top: 0;
              margin-bottom: 40px;
              text-align: center;
            }
            .produk-mes{
              border-radius: 50%;
              width: 500px;
              height: 600px;
              z-index: -100;
              position: relative;
              bottom: 20px
            }
          </style>
        </head>
        <body>
          <div class="canvas">
            <div class="card">
            
              <h3 class="name">${value}</h3>
            </div>
            <img class="produk-mes" src="/${imageName}" alt="${value}">
          </div>
        </body>
        </html>
        
        `;
    
      } else {
      var imageHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${value}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              width: 100%;
              margin: 0;
              background: rgba(0,0,0,0.05)
            }
            
            .name{
              font-size: 25px
            }
            .canvas {
              height: 100vh;
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: relative;
              bottom: 1%
            }
            .card {
              width: 200px;
              height: 80px;
              padding: 20px;
              border-radius: 20px;
              background: #f0f0f0;
              box-shadow: 10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff;
              transition: all 0.3s ease-in-out;
              margin-top: 70px;
              text-align: center;
            }
            .produk-mes{
              border-radius: 40px;
              width: 50%;
              height: 70%;
              z-index: -100;
              position: relative;
              bottom: -20px;
              left: 200px;
              background: #f0f0f0;
              box-shadow: 10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff;
              transition: all 0.3s ease-in-out;
            }
            .running{
              font-size: 25px;
              background: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div class="canvas">
          <marquee style='' class="running"> ${value} </marquee>
            <img class="produk-mes" src="/${imageName}" alt="${value}">
            <!--<h3 id="currentTime">TIME ZONE</h3>-->
          </div>


        </body>
        </html>
        
        `;
      }
    }
    res.send(imageHtml);
  } catch (err){
    console.log(err)
  }
});

app.get("/imagefix/:optional/:opsi/", (req, res) => {
  try {
  console.log(req.params.optional)
  const optionalitation = req.params.optional; //cover & front fuse
  const optionalitation2 = req.params.opsi; //only rear fuse
  if(optionalitation.toString() === '510' ){ //front cover red
    var imageName = 'front_cover_red.png';
  } else if(optionalitation.toString() === '130') { //front fuse
    var imageName = 'onefuse.png'
  } else if(optionalitation.toString() === '410') { //front cover blue
    var imageName = 'front_cover_blue.png';
  } else if(optionalitation.toString() === '310') { //front cover grey
    var imageName = 'front_cover_gray.png';
  } else if(optionalitation.toString() === '114') { //back cover red
    var imageName = 'back_cover_red.png'
  } else if(optionalitation.toString() === '113') { //back cover blue
    var imageName = 'back_cover_blue.png'
  } else if(optionalitation.toString() === '112') { //back cover grey
    var imageName = 'back_cover_gray.png'
  } else {
    var imageName = optionalitation;
  }

  console.log(imageName)

  const value = path.parse(imageName).name;

    var imageHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${value}</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
          margin: 0;

        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
        .name{
          font-size: 25px
        }
        .canvas {
          display: flex;
          position: relative;
          left: 180px;
          right: 10px;
          top: 120px;
          bottom: 30px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%; 
        }
        .card {
          height: 100%;
          width: 100%; 
          padding: 20px;
          border-radius: 20px;
          background: #f0f0f0;
          box-shadow: 10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff;
          transition: all 0.3s ease-in-out;
          margin-top: 0;
          margin-bottom: 40px;
          text-align: center;
        }
        .produk-mes{
          border-radius: 50%;
          width: 60%;
          height: 60%;
          z-index: -100;
          position: relative;
          bottom: 50px
        }
      </style>
    </head>
    <body>
      <div class="canvas">
        <div style="display:none" class="card">
        
          <h3 style="display:none" class="name">${value}</h3>
        </div>
        <img class="produk-mes" src="/${imageName}" alt="${value}">
      </div>
    </body>
    </html>
    
    `;
    res.send(imageHtml);
  } catch (err){
    console.log(err)
  }
} );

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
reload(app);
