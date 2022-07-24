$(document).ready(function () {
  $("#giftCardForm").on("submit", function (e, data) {
    e.preventDefault();
    fetch("/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountName: $("#accountName").val(),
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
        setTimeout(function () {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  $("#editAccountId").on("submit", function (e, data) {
    e.preventDefault();
    fetch(`/account/${$("#editAccountId").val()}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountName: $("#editAccountName").val(),
      }),
    })
      .then(async (x) => {
        let msg = await x.json();
        if (msg.status == "Success") {
          $("#editErrorSuccessMsg").addClass("text-success");
        } else {
          $("#editErrorSuccessMsg").addClass("text-danger");
        }
        document.getElementById("editErrorSuccessMsg").innerHTML = msg.message;
        setTimeout(function () {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
function editAccountModal(id, accountName) {
  $("#editAccountId").val(id);
  $("#editAccountName").val(accountName);
}
