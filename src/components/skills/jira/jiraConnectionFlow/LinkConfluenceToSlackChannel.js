import React, { Component } from 'react'
import {Result} from 'antd'

export default class LinkConfluenceToSlackChannel extends Component {
    render() {
        return (
          <div
          style={{
            minHeight: 400,
            maxHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Result
            status="success"
            title="Successfully Connected to Confluence!"
            subTitle="You can now setup a Wiki channel in Slack by connecting the channel to Confluence space(s)"
          />
        </div>
        )
    }
}
