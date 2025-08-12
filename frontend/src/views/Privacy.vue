<template>
  <div class="privacy-container">
    <el-card class="privacy-card">
      <div slot="header" class="clearfix">
        <span>隐私政策</span>
      </div>
      <div class="privacy-content">
        <h3>一、隐私政策引言</h3>
        <p>1.1 我们尊重并保护您的隐私。本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息。</p>
        <p>1.2 请您在使用本平台前，仔细阅读本隐私政策。您使用本平台的行为将视为您已阅读并同意本隐私政策的全部内容。</p>

        <h3>二、信息收集与使用</h3>
        <p>2.1 我们收集的信息包括您在注册时提供的信息（如用户名、密码、邮箱、手机号等），以及您在使用本平台过程中产生的信息（如浏览记录、发布的信息等）。</p>
        <p>2.2 我们收集信息的目的是为了向您提供更好的服务，包括但不限于：账户管理、个性化推荐、服务改进等。</p>
        <p>2.3 我们不会将您的个人信息出售、出租或转让给第三方，除非获得您的明确同意或法律法规另有规定。</p>

        <h3>三、信息存储与保护</h3>
        <p>3.1 我们将您的个人信息存储在安全的服务器上，并采取合理的技术措施和管理措施，保护您的个人信息免受未授权访问、使用或泄露。</p>
        <p>3.2 您的个人信息的存储期限将根据法律法规的要求和服务的需要确定。</p>

        <h3>四、用户权利</h3>
        <p>4.1 您有权访问、更正或删除您的个人信息。您可以通过本平台的相关功能或联系我们的客服来行使这些权利。</p>
        <p>4.2 如您发现您的个人信息被非法使用，应立即通知我们，我们将采取合理措施协助您解决问题。</p>

        <h3>五、第三方服务</h3>
        <p>5.1 本平台可能包含第三方服务的链接或集成了第三方服务。这些第三方服务有其自己的隐私政策，我们不对这些第三方服务的隐私政策负责。</p>
        <p>5.2 您在使用这些第三方服务时，应仔细阅读其隐私政策。</p>

        <h3>六、隐私政策的修改</h3>
        <p>6.1 我们有权根据法律法规的变化或业务发展需要，随时修改本隐私政策。修改后的隐私政策将在本平台公布，您继续使用本平台将视为您已接受修改后的隐私政策。</p>

        <h3>七、联系我们</h3>
        <p>7.1 如您对本隐私政策有任何疑问，或需要行使您的权利，您可以通过以下方式联系我们：</p>
        <p>7.2 邮箱：[contact@example.com]</p>
        <p>7.3 电话：[400-123-4567]</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPage'
}
</script>

<style scoped>
.privacy-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}
.privacy-card {
  width: 800px;
}
.privacy-content {
  line-height: 1.8;
  color: #333;
}
.privacy-content h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #1f2d3d;
}
.privacy-content p {
  margin-bottom: 10px;
}
</style>