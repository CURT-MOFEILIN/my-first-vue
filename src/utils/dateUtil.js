export default class dateUtil {
  static dateFormater = (date) => {
    if (date != null) {
      var fdate = new Date(date)
      var year = fdate.getFullYear()
      var month = fdate.getMonth() + 1 < 10 ? '0' + (fdate.getMonth() + 1) : fdate.getMonth() + 1
      var day = fdate.getDate() < 10 ? '0' + fdate.getDate() : fdate.getDate()
      var hours = fdate.getHours() < 10 ? '0' + fdate.getHours() : fdate.getHours()
      var minutes = fdate.getMinutes() < 10 ? '0' + fdate.getMinutes() : fdate.getMinutes()
      var seconds = fdate.getSeconds() < 10 ? '0' + fdate.getSeconds() : fdate.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
  }
}
