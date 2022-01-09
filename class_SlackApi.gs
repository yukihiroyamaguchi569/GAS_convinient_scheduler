class SlackApi {
  constructor() {
    this.prop = new Properties();
    this.token = this.prop.get('USER_OAUTH_TOKEN');
    this.botToken = this.prop.get('BOT_USER_OAUTH_TOKEN');
  }

  /**
   * Slackワークスペースの中からアクティブなチャンネル（archiveされていないチャンネル）の
   * チャンネル名とIDを持つ配列をつくるメソッド
   * @return {Array} アクティブなチャンネル（archiveされていないチャンネル）のチャンネル名とIDを持つ配列
   */
  getActiveChannelsValues() {
    const channelValues = this.getChannelsValues();
    const activeChannelsValues = channelValues.filter(record => record[2] === false).
      map(record => [record[0], record[1]]);
    return activeChannelsValues;
  }

  /**
    * Slack チャンネルの必要な情報を持つ配列をつくるメソッド
    * @return {Array.<Array.<string|boolean>} slack チャンネルの必要な情報を持つ配列
    */
  getChannelsValues() {
    const channels = this.getChannels();
    const channelValues = channels.map(channelInfo => {
      const { name, id, is_archived } = channelInfo;
      return [name, id, is_archived];
    });
    channelValues.sort((a, b) => a[0].localeCompare(b[0], 'ja'));
    return channelValues;
  }

  /**
   * Slack チャンネルの情報をオブジェクトとして持つ配列を生成するメソッド
   * @return {Array.<Object>} slack チャンネルの情報
   */
  getChannels() {
    const conversations = this.getConversations();
    const channels = conversations.channels;
    return channels;
  }

  /**
   * Slack チャンネルの詳細な情報を持つオブジェクトを取得するメソッド
   * @return {Object} slack チャンネルの情報
   */
  getConversations() {
    const params = this.getParams();
    const url = this.buildConversationsListUrl();
    const conversations = this.getAsObject(url, params);
    return conversations;
  }

  /**
   * fetch メソッドで利用する conversations.list の URL を生成するメソッド
   * @return {string} fetch メソッド用の URL
   */
  buildConversationsListUrl() {
    const limit = 1000;
    const teamId = 'nonproken';
    const url = 'https://slack.com/api/conversations.list?' +
      'limit=' + limit + '&' +
      'team_id=' + teamId;
    return url;
  }

  /**
    * Slack 名,	Slack 表示名,	Slack IDの情報を持つ二次元配列を取得するメソッド
    * @return {Array} Slack 名,	Slack 表示名,	Slack IDの情報を持つ二次元配列
    */
  getMembersValues() {
    const members = this.getUsersList().members;
    const membersValues = members.map(member => {
      const profile = member.profile;
      return [profile.real_name, profile.display_name, member.id];
    });
    membersValues.sort((a, b) => a[0].localeCompare(b[0], 'ja'));
    return membersValues;
  }

  /**
   * Slack ユーザーの詳細な情報を持つオブジェクトを取得するメソッド
   * @return {Object} Slack ユーザーの情報
   */
  getUsersList() {
    const params = this.getParams();
    const url = this.buildUsersListUrl();
    const usersList = this.getAsObject(url, params);
    return usersList;
  }

  /**
   * fetch メソッドで利用する users.list の URL を生成するメソッド
   * @return {string} fetch メソッド用の URL
   */
  buildUsersListUrl() {
    const limit = 1000;
    const teamId = 'nonproken';
    const url = 'https://slack.com/api/users.list?' +
      'limit=' + limit + '&' +
      'team_id=' + teamId;
    return url;
  }

  /**
    * Slack チャンネルの必要な情報を持つ配列をつくるメソッド
    * @return {Array.<Array.<string|boolean>} slack チャンネルの必要な情報を持つ配列
    */
  getConversationsMemberIds(channel) {
    const memberIds = this.getConversationsMembersList(channel).members;
    return memberIds;
  }

  /**
   * Slack ユーザーの詳細な情報を持つオブジェクトを取得するメソッド
   * @return {Object} Slack ユーザーの情報
   */
  getConversationsMembersList(channel) {
    const params = this.getParams();
    const url = this.buildConversationsMembersUrl(channel);
    const usersList = this.getAsObject(url, params);
    return usersList;
  }

  /**
   * fetch メソッドで利用する conversations.members の URL を生成するメソッド
   * @return {string} fetch メソッド用の URL
   */
  buildConversationsMembersUrl(channel) {
    const limit = 1000;
    const url = 'https://slack.com/api/conversations.members?' +
      'limit=' + limit + '&' +
      'channel=' + channel;
    return url;
  }

  /**
    * fetch メソッド用のパラメーターを生成するメソッド
    * @param {string} method - GET or げｔ メソッド。デフォルト引数は GET
    * @param {string} token - 利用するトークン。デフォルト引数は this.botToken
    * @return {Object} fetch メソッド用のパラメーター
    */
  getParams(method = 'GET', token = this.botToken) {
    const params = {
      method: method,
      headers: {
        Authorization: 'Bearer ' + token
      }
    };
    return params;
  }

  /**
   * UrlFetchApp を利用して取得した値をオブジェクト化して返す関数
   * @param {string} url - fetch メソッド用の URL
   * @param {Object} params - fetch メソッド用のパラメーター
   */
  getAsObject(url, params) {
    const response = UrlFetchApp.fetch(url, params);
    const json = response.getContentText();
    const object = JSON.parse(json);
    return object;
  }

  /**
   * channelId を受け取って、Slack 名	とSlack 表示名を二次元配列で返す関数
   * @param {string} channelId - 特定のチャンネルのID
   * @param {array} slackNameValues - Slack 名	とSlack 表示名の二次元配列
   */
  getSlackNameValuesById(channelId) {
    const memberIds = this.getConversationsMemberIds(channelId);
    const membersValues = this.getMembersValues();
    const slackNameValues = memberIds.map(memberId => membersValues.
      find(record => record[2] === memberId)).
      map(record => [record[0], record[1], record[2]]);
    return slackNameValues;
  }

  // /**
  //  * slack ID からメンションを作成する関数
  //  * @param {string} slackId - メンションする対象の slack ID
  //  * @return {string} メンション
  //  */
  // getUserMention(slackId) {
  //   const mention = '<@' + slackId + '>';
  //   return mention;
  // }
}


/**
 * テスト用関数
 */

function testSlackApi() {

  const slackApi = new SlackApi();
  // const memberIds,  = slackApi.getConversationsMemberIds('C97THVBL6');
  const slackNames = slackApi.getSlackNameValuesById('C02Q523KNQY');

  return;

  // チャンネル名ー一覧とチャンネル名とIDを返す
  console.log(SlackApi.getAllChannels());

  // メンバーの名前、表示名、IDを取得して返す
  console.log(SlackApi.getAllMembers())

  //催促したい人のアカウント名を一次元配列で受け取って,催促の文面を作るメソッド
  console.log(SlackApi.makeMessageBody);

  //投稿するチャンネル名をうけとって、Slackに文面を投稿するメソッド
  console.log(SlackApi.post());

}
