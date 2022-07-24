$(document).ready(function () {
  $("#debitCreditModelId").on("submit", function (e, data) {
    e.preventDefault();
    fetch("/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionType: $("#transactionTypeId").val(),
        accountId: $("#accountId").val(),
        amount: $("#dAndCAmountId").val(),
        adFrom: $("#exampleTransferAmount").val(),
        note: $("#noteId").val(),
      }),
    })
      .then(async (x) => {
        let msg = await x.json();
        if (msg.status == "Success") {
          $("#ErrorSuccessMsg").addClass("text-success");
        } else {
          $("#ErrorSuccessMsg").addClass("text-danger");
        }
        document.getElementById("ErrorSuccessMsg").innerHTML = msg.message;
        // setTimeout(function () {
        //   location.reload();
        // }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
function addTransactionType(type) {
  $("#transactionTypeId").val(type);
  let dynamicHeader = type === "C" ? "Add Credit Note." : "Add Debit Note.";
  document.getElementById("noteModalHeader1").innerHTML = dynamicHeader;
}
