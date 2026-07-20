import express from "express";
import cors from cors;

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(
    cors({ origin: "https://localhost:5173"})
);





app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço ${PORT}`);
})