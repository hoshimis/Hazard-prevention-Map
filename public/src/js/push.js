const sendPushNotification = () => {
  console.log("notification");
  Push.create("sample", {
    body: "sample.message",
    icon: "../images/sample.png",
    timeout: 5000,
    onClick: function () {
      this.close();
      location.href = "/";
    },
  });
  console.log("notification");
};
