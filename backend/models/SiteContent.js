import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      default: "legal",
    },
    privacyPolicy: {
      type: String,
      default: "Your privacy is critically important to us. Rubrik Reset respects your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to our application and governs data collection and usage.",
    },
    termsOfService: {
      type: String,
      default: "These terms and conditions outline the rules and regulations for the use of Rubrik Reset's Website. By accessing this website we assume you accept these terms and conditions. Do not continue to use Rubrik Reset if you do not agree to take all of the terms and conditions stated on this page.",
    },
  },
  { timestamps: true }
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);

export default SiteContent;
