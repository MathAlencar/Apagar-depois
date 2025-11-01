import app from './App'; // Ele já está sendo exportado e executado ao mesmo tempo.

const port = 3018;

app.listen(port, () => {
  console.log(`O App está rodando na portas ${port}...`);
});
