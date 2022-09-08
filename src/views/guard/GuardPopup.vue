<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i><div v-if="popupState=='ins'">사용자 등록</div><div v-else>사용자 수정</div>
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col" width="28%">이메일</th>
            <td><input v-model="guard.email" type="text" class="form-control d-inline-flex" id="userEmail" name="userEmail">
              <br><span class="description-text">ex) aaa@kokasin.com</span>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자명</th>
            <td><input v-model="guard.guardName" type="text" class="form-control d-inline-flex" id="userName" name="userName"></td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">IMEI</th>
            <td><input type="text" v-model="guard.email" class="form-control d-inline-flex" id="deviceID" name="deviceIMEI" readonly>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">소속 기관</th>
            <td>
              <select v-model="guard.orgCd" id="group" name="group" class="form-select d-inline-flex">
                <option value=""> - 선택 - </option>
                <option value="true"> 개인 </option>
                <option value="false">홀트복지재단</option>
                <option value="false">성북장애인재단</option>
              </select>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호0</th>
            <td>
              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="true"> 010 </option>
                <option value="false">011</option>
                <option value="false">016</option>
                <option value="false">017</option>
                <option value="false">018</option>
                <option value="false">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호1</th>
            <td>
              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="true"> 010 </option>
                <option value="false">011</option>
                <option value="false">016</option>
                <option value="false">017</option>
                <option value="false">018</option>
                <option value="false">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex"
                     style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex"
                     style="width: 100px;" maxlength="4">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호2</th>
            <td>
              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="true"> 010 </option>
                <option value="false">011</option>
                <option value="false">016</option>
                <option value="false">017</option>
                <option value="false">018</option>
                <option value="false">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호3</th>
            <td>
              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="true"> 010 </option>
                <option value="false">011</option>
                <option value="false">016</option>
                <option value="false">017</option>
                <option value="false">018</option>
                <option value="false">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">사용자 전화번호4</th>
            <td>
              <select id="protectorPhone1" name="protectorPhone1" class="form-select d-inline-flex" style="width: 100px;">
                <option value="true"> 010 </option>
                <option value="false">011</option>
                <option value="false">016</option>
                <option value="false">017</option>
                <option value="false">018</option>
                <option value="false">019</option>
              </select>
              -
              <input type="text" id="protectorPhone2" name="protectorPhone2" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
              -
              <input type="text" id="protectorPhone3" name="protectorPhone3" class="form-control d-inline-flex" style="width: 100px;" maxlength="4">
            </td>
          </tr>
        </table>
      </div>
    </div>
    <p class="text-end">
      <button class="btn btn-primary mb-1 ms-1" onclick="javascript:deleteUser()">삭제</button>
      <button class="btn btn-primary mb-1 ms-1" onclick="javascript:modifyUser()">수정</button>
    </p>
  </div>
</template>

<script>
export default {
  name: "GuardPopup"
}
</script>

<style scoped>

</style>