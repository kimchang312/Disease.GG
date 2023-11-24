const Router = require('express');
const lolhelper = require(.../helper/lolhelper);

const lolRouter = Router();

lolRouter.get('/search', async (req, res) => {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: '유저 아이디 입력이 필요합니다.',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});
