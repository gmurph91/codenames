import React, {Component} from 'react';
export default class Card extends Component{
    render(){
        return (
                <div className="card">
                    <div className="picture"><img src="./card.jpg" className="thumbnail" alt="thumbnail"/>
                    <p className="word">{this.props.word}</p>
                    </div>
                </div>
        )
    }
}