export interface Config {
    data: {
        config: {
            showCouponField: boolean;
        };
        update: {
            showUpdateCardAndroid?: boolean;
            lastVersionOnPlayStore: string;
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