<?php

$fp = fopen("CustomerOrders.txt","a");

if (!$fp)
{
	echo "Your order could not be processed at this time.";
	exit;
}
$cart = json_decode($_POST["cart"]);
$creditCardInfo = json_decode($_POST["ccInfo"]);
$customerBillingInfo = json_decode($_POST["csmtblInfo"]);
$customerShippingInfo = json_decode($_POST["csmtspInfo"]);
$total = json_decode($_POST["totalPrice"]);

$date = date('jS F Y, H:i');
$orderID = "\n\n\nOrder# ".uniqid();
$outputString1 = "\n".$date;
$max = sizeof($cart);
$dateString = "\n".$date;

fwrite($fp, $orderID.$dateString);
for($i = 0; $i < $max;$i++)
{
	fwrite($fp,"\n".$cart[$i]->quantity."x ".$cart[$i]->name." $".$cart[$i]->subtotal);
}
fwrite($fp, "\n\nOrder Total: $".$total);
fwrite($fp, "\n\nShipping Address: \nAddress Line 1: ".$customerShippingInfo->address1
		."\nAddress Line 2: ".$customerShippingInfo->address2."\nCity: ".$customerShippingInfo->city
		."\nStates: ".$customerShippingInfo->state."\nZip Code: ".$customerShippingInfo->zipCode);
fwrite($fp, "\n\nPayment Information: \nName: ".$creditCardInfo->name
		."\nCredit Card Number: ".$creditCardInfo->creditCardNum."\nExpiration Date: ".$creditCardInfo->expiration
		."\nCVV Code: ".$creditCardInfo->securityCode);
fwrite($fp, "\n\nBilling Address: \nAddress Line 1: ".$customerBillingInfo->address1
		."\nAddress Line 2: ".$customerBillingInfo->address2."\nCity: ".$customerBillingInfo->city
		."\nStates: ".$customerBillingInfo->state."\nZip Code: ".$customerBillingInfo->zipCode);
fclose($fp);

?>