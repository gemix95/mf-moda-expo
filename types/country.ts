export interface Country {
    name: string;
    isoCode: string;
    currency: {
      name: string;
      symbol: string;
      isoCode: string;
    };
  };