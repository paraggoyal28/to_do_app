import React from 'react';
import './index.css';

class Item extends React.Component {
    constructor(props) {
        super(props);
    }


    handleMouseEnter = (e) => {
        const deleteIcon = document.getElementById('delete' + e.target.dataset.num);
        const addIcon = document.getElementById('add' + e.target.dataset.num);
        deleteIcon.style.display = 'inline-block';
        addIcon.style.display = 'inline-block';

    }

    handleMouseLeave = (e) => {
        const deleteIcon = document.getElementById('delete' + e.target.dataset.num);
        const addIcon = document.getElementById('add' + e.target.dataset.num);
        deleteIcon.style.display = 'none';
        addIcon.style.display = 'none';
    }

    handleAddDescription = (e) => {
        const descriptionBox = document.getElementById('descriptionInput' + e.target.dataset.num);
        const descriptionText = document.getElementById('description' + e.target.dataset.num);
        descriptionBox.style.display = 'inline-block';
        descriptionText.style.display = 'none';
    }



    render() {
        const { id, marked, createdAt, lastUpdatedAt, deleted, text, description } = this.props.item;
        return (
            <div data-num={id}>
                <div data-num={id} id={'view' + id} className="view" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                    <div data-num={id}>
                        <input data-num={id} className="toggle" type="checkbox" checked={marked} id={"check" + id} onChange={this.props.handleChangeSingle} />
                        <label data-num={id} className="viewText">{text}</label>
                        <a data-num={id} id={'add' + id} className="add" onClick={this.handleAddDescription}></a>
                        <a data-num={id} id={'delete' + id} className="delete" onClick={this.props.handleDelete}></a>
                    </div>
                    <div data-num={id} className="description" id={'description' + id}>
                        {description}
                    </div>
                    <div data-num={id} className="date">
                        <span data-num={id} className="created">Created At: {createdAt} </span>
                        <span data-num={id} className="updated">Last Updated At: {lastUpdatedAt}</span>
                    </div>
                </div>
                <input data-num={id} className="descriptionInput" value={description} id={'descriptionInput' + id} onKeyPress={this.props.handleKeyPress}
                    onChange={this.props.handleDescriptionChange} />
            </div>
        )
    }
}

export default Item;