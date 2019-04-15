import axios from 'axios';

/** 全局常量 */

/**
 * Created by hh on 17/12/20.
 *获取外部config输入的常量，iam_clientid,iam_sso_host,iam_sso_redirect_uri
 *@param
 *@return
 */
const getGlobal = () => {
  return new Promise((resolve, reject) => {
    axios.get('./serverconfig.json?v=' + (+new Date())).then((response) => {
      if (response && response.data) {
        resolve(response);
      }
    }).catch((error) => {
      reject(error);
    });
  });
};

export default {

  getGlobal
};
