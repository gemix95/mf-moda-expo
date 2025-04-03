export interface Config {
    data: {
        cart: {
            abandonedCartNotification: {
                title: {
                    en: string;
                    it: string;
                },
                enabled: boolean;
                message: {
                    en: string;
                    it: string;
                },
                delayMinutes: number;
            }
        },
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