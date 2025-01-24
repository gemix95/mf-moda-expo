export interface Config {
    data: {
        config: {
            showCouponField: boolean;
        };
        update: {
            showUpdateCard: boolean;
            minSupportedVersion: string;
        };
        dynamicLogo: {
            enabled: boolean;
            urlImage: string;
        };
        maintenance: {
            enabled: boolean;
        };
    }
  }