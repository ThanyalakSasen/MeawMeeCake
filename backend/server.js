require("dotenv").config();
const app = require("./app");



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('=== Environment Variables ===');
  console.log('PORT:', process.env.PORT);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('BACKEND_URL:', process.env.BACKEND_URL);
  console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
  console.log('============================');
});
