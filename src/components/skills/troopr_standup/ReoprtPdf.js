// import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import { Icon as LegacyIcon } from "@ant-design/compatible";
// import {
//   Card,
//   Typography,
//   Row,
//   Col,
//   Tooltip,
//   PageHeader,
//   Avatar,
//   Tag,
//   Select,
//   DatePicker,
//   Popconfirm,
//   Button,
// } from "antd";
// import { DownloadOutlined } from "@ant-design/icons";
// // import {
// //   Page,
// //   Text,
// //   View,
// //   Document,
// //   StyleSheet,
// //   PDFDownloadLink,
// //   Image,
// // } from "@react-pdf/renderer";

// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// // import rasterizeHTML from "rasterizeHTML";

// import favicon from "./trIcon.png";

// class StandupHistory extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { ready: false };
//   }

//   toggle() {
//     this.setState(
//       (prevState) => ({
//         ready: false,
//       }),
//       () => {
//         // THIS IS THE HACK
//         setTimeout(() => {
//           this.setState({ ready: true });
//         }, 1);
//       }
//     );
//   }

//   findUser = (id) => {
//     const { allMembers } = this.props;
//     // let user =
//     //   this.props.userTeamSync.selectedMembers &&
//     //   this.props.userTeamSync.selectedMembers.find((mem) => mem._id == id);
//     if (allMembers.length > 0) {
//       let user = allMembers && allMembers.find((mem) => mem._id == id);

//       if (user) {
//         return user.name;
//       } else {
//         user = allMembers && allMembers.find((mem) => mem.user_id._id == id);
//         if (user) {
//           return user.user_id.name;
//         } else {
//           return "";
//         }
//       }
//     }
//   };

//   // styles = StyleSheet.create({
//   //   page: {},
//   //   section: {
//   //     margin: 10,
//   //     padding: 10,
//   //     flexGrow: 1,
//   //   },
//   //   trIcon: {
//   //     width: "20px",
//   //   },
//   // });

//   // Create Document Component
//   // MyDocument = () => {
//   //   return (
//   //     <Document>
//   //       <Page size='A4' style={this.styles.page}>
//   //         <View style={this.styles.section}>
//   //           <Image src={favicon} style={this.styles.trIcon} />
//   //           <Text>hello</Text>
//   //         </View>
//   //       </Page>
//   //     </Document>
//   //   );
//   // };

//   handleDownloadPDF() {

//     let html2 = `
//     <html><body>
//     <img src="https://s3.ap-south-1.amazonaws.com/stage-trooprbucket/userProfilePic%2F5dc0407188d922185d4b0351avatar"/>
    
//     </body></html>
//     `

//     let iframe = document.createElement("iframe");
//     // iframe.width = 800;

//     document.body.appendChild(iframe);
//     let iframedoc = iframe.contentDocument || iframe.contentWindow.document;

//     iframedoc.body.innerHTML = html2;


//     html2canvas(iframedoc.body).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF();
//       pdf.addImage(imgData, "PNG", 0, 0);
//       pdf.save(`${this.props.workspaceName}_report.pdf`);
//     });
//   }

//   _handleDownloadPDF=async()=> {
//     let test= "<html><body><div  style='color:blue;text-align:center;font-size:12px'>See pdf hello  fewnfkjwenkfw   fnweknfkwe   nfwefkwef  fweklfmkwef w fwemflkwemflwmklf  </div></body></html>"
//     let html2 = `
//     <html><body>
//     <img src="https://picsum.photos/id/237/200/300"/>
    
//     </body></html>
//     `
//       const pdf = new jsPDF();
//       pdf.setFontSize(10);
//       pdf.setTextColor(255, 0, 0);
//      await   pdf.html(html2)
        
    
  
//       console.log(pdf)
//       pdf.save("hell_report.pdf");

//   }

//   render() {
//     const { userTeamSync, standupHistory } = this.props;

//     console.log(userTeamSync, standupHistory);

//     return (
//       <Fragment>
//         <div id='pdf'></div>
//         <Tooltip placement='top' title='Downlaod as pdf'>
//           <Button
//             // type='circle'
//             icon={<DownloadOutlined />}
//             style={{ marginRight: "16px" }}
//             onClick={() => this._handleDownloadPDF()}
//           ></Button>
//         </Tooltip>

//         {/* <div>
//           {this.state.ready && (
//             <PDFDownloadLink
//               document={<this.MyDocument />}
//               fileName='somename.pdf'
//             >
//               {({ blob, url, loading, error }) =>
//                 loading ? "Loading document..." : "Download now!"
//               }
//             </PDFDownloadLink>
//           )}
//         </div>

//         {!this.state.ready && (
//           <Button onClick={() => this.toggle()}>generate pdf</Button>
//         )} */}
//       </Fragment>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   userTeamSync: state.skills.userTeamSync,
//   teamSync: state.skills.currentteamsync,
//   user_now: state.common_reducer.user,
//   standupHistory: state.skills.standupHistory,
//   members: state.skills.members,
//   skills: state.skills,
// });
// export default withRouter(connect(mapStateToProps, {})(StandupHistory));
