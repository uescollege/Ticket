
document.addEventListener("DOMContentLoaded", function () {
  const form_validator = document.querySelector('#kt_sign_in_form');
  const fields = [];
  const validator = FormValidation.formValidation(
    form_validator,
    {
      fields: fields,
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: '.fv-row',
            eleInvalidClass: '',  // comment to enable invalid state icons
            eleValidClass: '' // comment to enable valid state icons
        })
      }
    });
  
  validator.validate().then(function (status) {
    if (status == 'Valid') {
                
    } else {
        
    }
  });
});
