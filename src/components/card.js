import React, {Component} from 'react';
export default class Card extends Component{
    render(){
        return (
                <div className="card" onClick={this.props.selectHandler} data-name={this.props.word}>
                    <div className="picture"><img id={this.props.word} src="./card.jpg" className="thumbnail" alt="thumbnail"/>
                    <p className="word">{this.props.word}</p>
                    </div>
                </div>
        )
    }
}