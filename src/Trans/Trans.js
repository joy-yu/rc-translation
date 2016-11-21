import React, {Component} from 'react';
import {ajax} from 'jquery';
import './Trans.css';

export default class Transbox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      explains: [],
      firposX: 0,
      firposY: 0,
      posX: 0,
      posY: 0
    };
    this.getExplains = this.getExplains.bind(this);
    this.showTrans = this.showTrans.bind(this);
    this.init = this.init.bind(this);
  }

  resetState() {
    this.setState({
      title: '',
      explains: [],
      posX: 0,
      posY: 0
    });
  }
/*
  fetchJSON(url,cb) {
    let xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.onreadystatechange = function() {
      if (this.readystate === 4) {
        if (this.status >= 200 && this.status < 400) {
          let data = JSON.parse(this.responseText);
          cb(data);
        } else {
          console.error('fetchJSON error!');
        }
      }
    };
    xhr.send();
  }
*/
  getExplains(e) {

    //ajax有时延，解决内容改变的可见化问题。
    this.resetState();

    let text = (window.getSelection ? window.getSelection().toString() : document.selection.createRange().text).trim();

    this.setState({
      posX: e.pageX,
      posY: e.pageY
    });

    if (this.state.posX - this.state.firposX !== 0 || this.state.posY - this.state.firposY !== 0) {
      if (text) {

        let protocol = location.protocol;
        let url = encodeURI(protocol + '//fanyi.youdao.com/openapi.do?keyfrom=microheart&key=1363430402&type=data&doctype=jsonp&version=1.1&q=' + text);
        //this.fetchJSON(url,showTrans.bind(this));
        ajax({
            url: url,
            type: "GET",
            dataType: "JSONP",
            success: this.showTrans
        });
      }
    }
  }

  showTrans(data) {

    //errorCode为0肯定没错误啦，错误处理待写。
    if (!data.errorCode) {
      let temp = [];
      if (data.basic && data.translation) {
        temp = data.translation.concat(data.basic.explains);
      } else {
        temp = data.translation || data.basic.explains;
      }
      this.setState({
        title: data.query, //不在getExplains那添加title，解决title先出explains后出现的问题。
        explains: temp
      });
    }
  }

  init(e){
    this.setState({
      firposX: e.pageX,
      firposY: e.pageY
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
    //const H = window.innerHeight || document.documentElement.clientHeight;

    let lastPosX = this.state.posX > W - 300
                   ? W - 300
                   : this.state.posX;
    let boxPos = {
      top: this.state.posY + 20,
      left: lastPosX
    };

    if (this.state.title) {
      return (
        <div className="Trans-box" style={boxPos}>
          <p className="Trans-title">{this.state.title}</p>
          {
            this.state.explains.map(function(v, i){
              return (<p key={i}>{v}</p>);
            })
          }
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
