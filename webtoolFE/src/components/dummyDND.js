import React, { Component } from 'react';
import "../styles/DragDrop.css"
class DragDrop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            droppedNumbers: {
                'numbers': [1, 2, 3, 4, 5, 6, 7, 8, 9],
                '1': [11, 12],
                '2': [],
            },
            group: 5,
            dragFrom: ''
        }
    }
    
    componentWillMount() {
        for (let i = 3; i <= this.state.group; i++) {
            let newObject = this.state.droppedNumbers
            newObject[`${i}`] = []
            this.setState({ droppedNumbers: newObject })//look at state, new keys added
        }
    }
    onDragStartHandler = (event, value) => {
        console.log(value)
        console.log(event.target.id)
        this.setState({ dragFrom: event.target.id })//store which array data is removed from
        event.dataTransfer.setData("value", value)//store value in event object

    }
    onDropHandler = (event) => {
        let newObject = this.state.droppedNumbers//create new objectt
        const data = event.dataTransfer.getData("value")//get value from event object
        const id = event.target.id //getting dropped to id
        const removeData = this.state.droppedNumbers[`${this.state.dragFrom}`].filter(value => {
            return value != data
        })
        newObject[`${this.state.dragFrom}`] = removeData
        newObject[`${id}`].push(data)
        this.setState({ droppedNumbers: newObject })

    }
    onDragOverHandler = (event) => {
        event.preventDefault()//stop everything from happening at once
    }
    render() {
        return (
            //for loop here to render extra drop group
            <div className="dragDropContainer">
                <div
                    className="dropZone"
                    id='numbers'//getting from for loop, look above for example
                    onDragOver={event => this.onDragOverHandler(event)}
                    onDrop={event => this.onDropHandler(event)}
                >
                    <div>{this.state.droppedNumbers['numbers'].map((number) => {
                        return (
                            <div className="dragItems"
                                id='numbers'
                                draggable
                                onDragStart={event => this.onDragStartHandler(event, number)}>
                                {number}
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div
                    className="dropZone"
                    id='2'//getting from for loop, look above for example
                    onDragOver={event => this.onDragOverHandler(event)}
                    onDrop={event => this.onDropHandler(event)}
                >
                    <div>{this.state.droppedNumbers['2'].map((number) => {
                        return (
                            <div className="dragItems"
                                id='2'
                                draggable
                                onDragStart={event => this.onDragStartHandler(event, number)}>
                                {number}
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div
                    className="dropZone"
                    id='1'//getting from for loop, look above for example
                    onDragOver={event => this.onDragOverHandler(event)}
                    onDrop={event => this.onDropHandler(event)}
                >
                    {this.state.droppedNumbers['1'].map(item => {
                        return (
                            <div className="dragItems"
                                id='1'
                                draggable
                                onDragStart={event => this.onDragStartHandler(event, item)}>
                                {item}
                            </div>
                        )
                    })}
                </div>

            </div>
        )
    }
}

export default DragDrop;