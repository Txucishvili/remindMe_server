export const HomeController = async (req, res) => {
  console.log('hhhh');
  res.send(`Hello ----`);
};


export const homeRouter = {
  router: '/',
  middleware: [],
  handling: HomeController
};

