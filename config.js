const ENV = {
    dev: {
        apiUrl: 'http://10.0.2.2:5000',
    },
    prod: {
        apiUrl: 'https://your-render-app-url.onrender.com', // You'll get this URL from Render
    }
};

const getEnvVars = () => {
    if (__DEV__) {
        return ENV.dev;
    }
    return ENV.prod;
};

export default getEnvVars;