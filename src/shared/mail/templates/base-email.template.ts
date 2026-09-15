export const baseEmailTemplate = (title: string, content: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1A1025;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          background-color: #1A1025;
          border-radius: 6px;
          padding: 20px 16px;
          text-align: center;
          box-sizing: border-box;
        }
        .logo {
          margin-bottom: 30px;
        }
        .logo img {
          max-width: 150px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .content {
          background-color: #312346;
          border-radius: 12px;
          padding: 30px 20px;
          margin-bottom: 30px;
          text-align: left;
          box-sizing: border-box;
          width: 100%;
        }
        .title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #ffffff;
          text-align: center;
        }
        .footer {
          font-size: 14px;
          color: #cececeff;
        }
        .btn {
          display: inline-block;
          background-color: #7F41F0;
          color: #ffffff;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <!-- <img src="cid:logo" alt="Logo" /> -->
          <p style='font-size: 24px; font-weight: 700; color: #ffffff;'>Your App Logo or Name</p>
        </div>
        <div class="content">
          <div class="title">${title}</div>
          ${content}
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} -- App Name --. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};