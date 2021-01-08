import React, { Fragment } from 'react';
import './App.css';
import Item from './components/Item';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      idCount: 1,
      textValue: '',
      itemList: [],
      filteredList: [],
      searchValue: '',
      markedItemCount: 0,
      unmarkedItemCount: 0,
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const item = {
        id: this.state.idCount,
        marked: false,
        createdAt: new Date().toLocaleString(),
        lastUpdatedAt: new Date().toLocaleString(),
        deleted: false,
        text: e.target.value,
        description: "",
      }
      this.setState({
        itemList: [...this.state.itemList, item], idCount: this.state.idCount + 1,
        textValue: '', unmarkedItemCount: this.state.unmarkedItemCount + 1
      });
    }
  }

  handleTextChange = (e) => {
    this.setState({ textValue: e.target.value });
  }

  handleTextUpate = (e) => {
    const itemToUpdate = this.state.itemList.find(item => parseInt(item.id) === parseInt(e.target.dataset.num));
    itemToUpdate.text = e.target.value;
    const itemList = this.state.itemList.filter(item => parseInt(item.id) !== parseInt(e.target.dataset.num));
    itemList.push(itemToUpdate);
    this.setState({ itemList: itemList });
  }

  handleMarkingAll = (e) => {
    const checkState = this.state.markedItemCount === this.state.itemList.length;
    const itemList = this.state.itemList.map(item => {
      item.marked = checkState === true ? false : true;
      return item;
    });
    const deletedItemCount = itemList.filter(item => item.deleted).length;
    const markedItemCount = itemList.filter(item => item.marked && !item.deleted).length;
    const unmarkedItemCount = itemList.length - markedItemCount - deletedItemCount;
    this.setState({ itemList, markedItemCount, unmarkedItemCount });
  }

  handleDelete = (e) => {
    const id = e.target.dataset.num;
    const marked = e.target.marked;
    const itemList = this.state.itemList.map(item => {
      if (parseInt(item.id) === parseInt(id)) {
        item.deleted = true;
      }
      return item;
    });
    this.setState({
      itemList, markedItemCount: marked ? this.state.markedItemCount - 1 : this.state.markedItemCount,
      unmarkedItemCount: marked ? this.state.unmarkedItemCount : this.state.unmarkedItemCount - 1
    });
  }

  handleDeleteMarked = (e) => {
    let markedDeleteCount = 0;
    const itemList = this.state.itemList.map(item => {
      if (item.marked) {
        markedDeleteCount++;
        item.deleted = true;
      }
      return item;
    });
    this.setState({ itemList, markedItemCount: this.state.markedItemCount - markedDeleteCount, });
  }

  handleDescriptionChange = (e) => {
    const id = parseInt(e.target.dataset.num);
    const itemList = this.state.itemList.map(item => {
      if (parseInt(item.id) === id) {
        item.description = e.target.value;
      }
      return item;
    });
    this.setState({ itemList });
  }

  handleSearch = (e) => {
    const value = e.target.value;
    let filteredList = this.state.itemList;
    if (value.length >= 3) {
      filteredList = this.state.itemList.filter(item => (item.text &&
        item.text.toLowerCase().includes(value.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(value.toLowerCase())));
    }
    this.setState({ filteredList, searchValue: value });
  }

  handleKeyPressDescription = (e) => {
    if (e.key === 'Enter') {
      const descriptionBox = document.getElementById('descriptionInput' + e.target.dataset.num);
      const descriptionText = document.getElementById('description' + e.target.dataset.num);
      const id = parseInt(e.target.dataset.num);
      const itemList = this.state.itemList.map(item => {
        const words = item.description && item.description.slice(0, 140).split(' ') || [];
        const description = words && words.length && words.map(word => word.slice(0, 30)).join(' ') || '';
        if (parseInt(item.id) === id) {
          item.description = description;
          item.lastUpdatedAt = new Date().toLocaleString();
        }
        return item;
      });
      descriptionBox.style.display = 'none';
      descriptionText.style.display = 'inline-block';
      this.setState({ itemList });
    }
  }

  handleChangeSingle = (e) => {
    const id = parseInt(e.target.dataset.num);
    const itemList = this.state.itemList.map(item => {
      if (parseInt(item.id) === id) {
        item.marked = !item.marked;
      }
      return item;
    });
    const deletedItemCount = itemList.filter(item => item.deleted).length;
    const markedItemCount = itemList.filter(item => item.marked && !item.deleted).length;
    const unmarkedItemCount = itemList.length - markedItemCount - deletedItemCount;
    this.setState({ itemList, markedItemCount, unmarkedItemCount });
  }


  render() {
    const { textValue, searchValue, filteredList, unmarkedItemCount, markedItemCount, itemList } = this.state;
    return (
      <div className="todoapp">
        <h1 className="heading">TODOS</h1>
        <input id="new-todo" type="text" value={textValue} onKeyPress={this.handleKeyPress} onChange={this.handleTextChange} placeholder="What needs to be done?" />
        {(unmarkedItemCount !== 0 || markedItemCount !== 0) &&
          (
            <Fragment>
              <input id="toggle-all" type="checkbox"
                checked={markedItemCount === itemList.length}
                onChange={this.handleMarkingAll} />
              <label htmlFor="toggle-all" >Mark all as complete</label>
              <input id="search-todo" type="text" value={searchValue} onChange={this.handleSearch} placeholder="What you want to search?" />
              {searchValue && filteredList.length >= 1 && filteredList.map(item =>
                !item.deleted && (<Item key={item.id} item={item} handleDelete={this.handleDelete}
                  handleChangeSingle={this.handleChangeSingle}
                  handleKeyPress={this.handleKeyPressDescription}
                  handleDescriptionChange={this.handleDescriptionChange} />)
              )}
              {!searchValue && itemList.length >= 1 && itemList.map(item =>
                !item.deleted && (<Item key={item.id} item={item} handleDelete={this.handleDelete}
                  handleChangeSingle={this.handleChangeSingle}
                  handleKeyPress={this.handleKeyPressDescription}
                  handleDescriptionChange={this.handleDescriptionChange} />)
              )}

              <div className="footer">
                <span><b>{unmarkedItemCount}</b> items left </span>
                {markedItemCount > 0 && <a id="clear-completed" onClick={this.handleDeleteMarked}>Clear {markedItemCount} completed items</a>}
              </div>

            </Fragment>)}



      </div>
    )

  }
}

export default App;