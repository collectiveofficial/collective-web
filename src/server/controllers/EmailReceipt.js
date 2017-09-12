import React from 'react';
import ReactDOMServer from 'react-dom/server';

const EmailReceipt = (emailReceiptInfo) => {
  class App extends React.Component {
    render() {
      const dormPackagesTotalDollarAmount = emailReceiptInfo.dormPackagesOrdered * 6;
      const cookingPackagesTotalDollarAmount = emailReceiptInfo.cookingPackagesOrdered * 11;
      const deliveryFee = emailReceiptInfo.userWantsDelivery ? 3 : 0;
      const totalDollarAmount = dormPackagesTotalDollarAmount + cookingPackagesTotalDollarAmount + deliveryFee;
      return (
        <div>
          <p>Hi {emailReceiptInfo.firstName},</p>
          <br />
          <p>Your order details:</p>
          {emailReceiptInfo.dormPackagesOrdered > 0 ?
            <p>{emailReceiptInfo.dormPackagesOrdered} x Dorm Package{emailReceiptInfo.dormPackagesOrdered < 2 ? '' : 's'} ${dormPackagesTotalDollarAmount}</p>
            :
            <div></div>
          }
          {emailReceiptInfo.cookingPackagesOrdered > 0 ?
            <p>{emailReceiptInfo.cookingPackagesOrdered} x Cooking Package{emailReceiptInfo.cookingPackagesOrdered < 2 ? '' : 's'} ${cookingPackagesTotalDollarAmount}</p>
            :
            <div></div>
          }
          {emailReceiptInfo.userWantsDelivery > 0 ?
            <div>
              <p>Delivery ${deliveryFee}</p>
              <p>Delivery Address:</p>
              <p>{emailReceiptInfo.deliveryAddress}</p>
              <p>(Dropoff at door to apartment/house)</p>
            </div>
            :
            <div></div>
          }
          <p>Total Amount: ${totalDollarAmount}</p>
          <br />
          {emailReceiptInfo.userWantsDelivery ?
            <div></div>
            :
            <p>Please show the attached QR code to a BFF volunteer at the designated pickup location.</p>
          }
        </div>
      );
    }
  }

  // const EmailReceipt = ReactDOMServer.renderStaticMarkup(<App />);
  const emailReceipt = ReactDOMServer.renderToString(<App />);
  return emailReceipt
};

module.exports = EmailReceipt;
