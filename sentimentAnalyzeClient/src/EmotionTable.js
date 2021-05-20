import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    state = { eventList: [] }

    componentDidMount() {
        this.setState({ eventList: this.props.emotions});
    }

    render() {
        let li_ctr = 0;
        return (
            <div>
                {/*You can remove this line and the line below. */}
                <table className="table table-bordered">
                    <tbody>

                        {this.state.eventList.map(function (eventDetails) {
                            return (
                                <tr>
                                    <th style={{ flex: 1 }} scope="col" key={li_ctr++}>{eventDetails[0]}</th>
                                    <th style={{ flex: 1 }} scope="col" key={li_ctr++}>{eventDetails[1]}</th>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div >
        );
    }

}
export default EmotionTable;
