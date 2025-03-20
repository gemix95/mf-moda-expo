export interface Config {
    data: {
        config: {
            showCouponField: boolean;
        };
        update: {
            showUpdateCard: boolean;
            minSupportedVersion: string;
            minSupportedVersionAndroid?: string
        };
        dynamicLogo: {
            enabled: boolean;
            urlImage: string;
        };
        maintenance: {
            androidEnabled: boolean;
        };
    }
  }