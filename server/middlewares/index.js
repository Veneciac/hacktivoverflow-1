const User = require('../models/User')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const mongoose = require('mongoose')
const { verifyJwt } = require('../helpers')

module.exports = {
    isLogin (req, res, next) {
        if (!req.headers.token) {
            res.status(400).json({
                msg: `Please login first`
            })
        } else {
            try {
                let userId = verifyJwt(req.headers.token).id
                if (!mongoose.Types.ObjectId.isValid(userId)) {
                    res.status(400).json({
                        msg: `ID is not valid`
                    })
                } else {
                    User.findById(userId)
                        .then(found => {
                            if (!found) {
                                res.status(404).json({
                                    msg: `User not found`
                                })
                            } else {
                                req.currentUser = found
                                next()
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                msg: err.message
                            })
                        })
                }
            } catch (err) {
                res.status(400).json({
                    msg: 'Please login first'
                })
            }
        }
    },
    checkQues (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({
                msg: `ID is not valid`
            })
        } else {
            Question.findById(req.params.id).populate('user').populate('upvotes').populate('downvotes').exec()
                .then(found => {
                    if (!found) {
                        res.status(404).json({
                            msg: `Question not found`
                        })
                    } else {
                        req.currentQuestion = found
                        next()
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        msg: err.message
                    })
                })
        }   
    },
    checkAnswer (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({
                msg: `ID is not valid`
            })
        } else {
            Answer.findById(req.params.id)
                .then(found => {
                    if (!found) {
                        res.status(404).json({
                            msg: `Answer not found`
                        })
                    } else {
                        req.currentAnswer = found
                        next()
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        msg: err.message
                    })
                })
        }  
    },
    authUserQues (req, res, next) {
        if (String(req.currentQuestion.user._id) !== String(req.currentUser._id)) {
            res.status(401).json({
                msg: `You are not authorized`
            })
        } else {
            next()
        }
    },
    authUserAnswer (req, res, next) {
        if (String(req.currentAnswer.user._id) !== String(req.currentUser._id)) {
            res.status(401).json({
                msg: `You are not authorized`
            })
        } else {
            next()
        }
    }
}