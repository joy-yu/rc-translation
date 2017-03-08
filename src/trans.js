import React, { Component } from 'react';
import { getJSON } from 'jquery';
import './trans.css';
let lptl = location.protocol==='https:'?'https:':'http:';
const TRANSURL = lptl + '//fanyi.youdao.com/openapi.do?keyfrom=microheart&key=1363430402&type=data&doctype=jsonp&version=1.1&q=';


export default class Transbox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {title:'', explains:[]},
      firPos: {firPosX: 0, firPosY: 0},
      pos: {posX: 0, posY: 0},
    };
  }

  getExplains = (e) => {

    this.setState({pos: {posX: e.pageX, posY: e.pageY}});

    let text = (window.getSelection ? window.getSelection().toString() : document.selection.createRange().text).trim();
    let {posX, posY} = this.state.pos;
    let {firPosX, firPosY} = this.state.firPos;

    //解决相同区域点击触发重翻译的问题。
    if (posX - firPosX !== 0 || posY - firPosY !== 0) {

      if (text) {
        let url = encodeURI(TRANSURL + text);
        getJSON ({
            url: url,
            type: "GET",
            dataType: "JSONP",
            success: this.showTrans
        });
      }
    }
  }

  showTrans = (data) => {

    //errorCode为0肯定没错误啦。
    if (!data.errorCode) {
      let queryArr = [];
      if (data.basic && data.translation) {
        queryArr = data.translation.concat(data.basic.explains);
      } else {
        queryArr = data.translation || data.basic.explains;
      }
      this.setState({data: {title:data.query, explains:queryArr}});
    }
  }


  init = (e) => {
    this.setState({
      data: {title:'', explains:[]},
      firPos: {firPosX: e.pageX, firPosY: e.pageY},
    });
  }

  componentDidMount() {
    document.documentElement.addEventListener("mousedown", this.init);
    document.documentElement.addEventListener("mouseup", this.getExplains);
  }

  componentWillUnMount() {
    document.documentElement.removeEventListener("mousedown", this.init);
    document.documentElement.removeEventListener("mouseup", this.getExplains);
  }

  render() {
    const W = document.body.scrollWidth || document.documentElement.scrollWidth;
    let {posX, posY} = this.state.pos;
    let {title, explains} = this.state.data;
    let lastPosX = posX > W-300 ? W-300 : posX;
    let boxPos = {
      top: posY + 20,
      left: lastPosX
    };

    if (title) {
      return (
        <div className="trans-box" style={boxPos}>
          <p className="trans-title">{title}</p>
          {
            explains.map((v, i)=>{
              return (<p key={`exp${i}`}>{v}</p>);
            })
          }
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
