$(document).ready( () => {
  $('#showEdit').on('click', event => {
    $('#editVisible').slideDown(2000).css("display", "flex");
    $('#editVisibleTable').slideDown(2000).css("display", "block");
  });
});
