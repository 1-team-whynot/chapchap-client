export const email = (val) => {
  const regex = /^[0-9a-zA-Z](?!.*?[\-\_\.]{2})[a-zA-Z0-9\-\_\.]{3,63}@[0-9a-zA-Z](?!.*?[\-\_\.]{2})[a-zA-Z0-9\-\_\.]{3,63}\.[a-zA-Z]{2,3}$/;

  if(!val) {
    return '이메일과 비밀번호를 입력해주세요.';
  }

  if(!regex.test(val)) {
    return '올바른 이메일 형식이 아닙니다.';
  }

  return '';
}

export const password = (val) => {
  const regex = /^[0-9a-zA-Z!@#$%^&*]{6,20}$/;

  if(!val) {
    return '이메일과 비밀번호를 입력해주세요.';
  }

  if(!regex.test(val)) {
    return '대/소문자, 숫자, 특수문자 6~20자 이내로 입력해주세요.';
  }

  return '';
}

export const passwordChk = (password, passwordChk) => {
  if(!passwordChk) {
    return '비밀번호 확인은 필수입니다.';
  }

  return password === passwordChk ? '' : '비밀번호가 일치하지 않습니다.';
}

export const name = (val) => {
  const regex = /^[가-힣a-zA-Z]{2,40}$/;

  if(!val) {
    return '성함은 필수입니다.';
  }

  if(!regex.test(val)) {
    return '성함은 공백 없이 2~40자여야 합니다.';
  }

  return '';
}

export const phone = (val) => {
  const regex = /^[0-9]{11}$/;

  if(!val) {
    return '연락처는 필수입니다.';
  }

  if(!regex.test(val)) {
    return '하이픈(-) 제외 숫자 11자리 입력해주세요.';
  }

  return '';
}