import NodeCache from "node-cache";

const otpStore = new NodeCache({

    stdTTL: 300, // 5 minutes

    checkperiod: 60

});

export default otpStore;