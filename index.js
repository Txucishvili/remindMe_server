import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const API_PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Ruting init
app.get('/', [], (req, res) => {
  console.log('hhhh');
  res.send(`Hello ----`);
});

app.listen(process.env.PORT || API_PORT, () => {
  console.log(`🚀 LISTENING ON PORT http://localhost:${API_PORT}`);
});
