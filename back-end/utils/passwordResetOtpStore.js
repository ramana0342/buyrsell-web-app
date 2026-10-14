import NodeCache from "node-cache";

const passwordResetOtpStore = new NodeCache({
    stdTTL: 300,
    checkperiod: 60
});

export default passwordResetOtpStore;