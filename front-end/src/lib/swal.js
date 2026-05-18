import Swal from "sweetalert2";

const baseCustomClass = {
  popup: "rounded-3xl border border-white/10 bg-neutral-950 text-white shadow-2xl",
  title: "text-white",
  htmlContainer: "text-gray-400",
  confirmButton:
    "rounded-full bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200",
  cancelButton:
    "rounded-full border border-white/10 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20",
};

export function confirmSwal({
  title = "Are you sure?",
  text = "This action will continue.",
  confirmButtonText = "Yes, continue",
  cancelButtonText = "Cancel",
  icon = "question",
} = {}) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    background: "#0a0a0a",
    color: "#ffffff",
    buttonsStyling: false,
    customClass: baseCustomClass,
  });
}

export function loadingSwal({
  title = "Processing...",
  text = "Please wait a moment.",
} = {}) {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    background: "#0a0a0a",
    color: "#ffffff",
    buttonsStyling: false,
    customClass: baseCustomClass,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

export function successSwal({
  title = "Success",
  text = "Your changes have been saved.",
  timer = 1600,
} = {}) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    timer,
    showConfirmButton: false,
    background: "#0a0a0a",
    color: "#ffffff",
    buttonsStyling: false,
    customClass: baseCustomClass,
  });
}

export function errorSwal({
  title = "Something went wrong",
  text = "Please try again.",
} = {}) {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "Close",
    background: "#0a0a0a",
    color: "#ffffff",
    buttonsStyling: false,
    customClass: baseCustomClass,
  });
}

export async function closeSwal() {
  Swal.close();

  await new Promise((resolve) => setTimeout(resolve, 250));
}