import { message, notification } from "antd"
import { Toast } from "antd-mobile"
message.config({
  top: 100,
  maxCount: 1,
  duration: 1
});
notification.config({
  top: 50,
  duration: 3,
});

export default {
  onError(e: ErrorEvent) {
    e.preventDefault()
    if(e.message)
      // message.error(e.message)
      Toast.fail(e.message, 1);
  },
}
