describe('App Integration', () => {
  // function setup(overrides: Partial<> = {}) {
  //   render(<App />);
  // }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('on initial load', () => {
    it('should show no products', () => {
      //
    });
    it('should show no order products', () => {
      //
    });
    it('should show a loading indicator', () => {
      //
    });
  });

  describe('when the api successfully returns products', () => {
    it('should show the correct number', async () => {
      //
    });
    it('should not show a loading indicator', async () => {
      //
    });

    describe('and a product is selected', () => {
      it('should add the product to the order', async () => {
        //
      });
    });
  });
});

export {};
