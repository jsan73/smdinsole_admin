<template>
  <div class="m-4">
    <h5 class="pb-2">
      <i class="bi bi-caret-right-square"></i> 기관 등록
    </h5>

    <div class="card">
      <div class="card-body pb-0">
        <table class="table table-sm table-bordered">
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">기관명</th>
            <td><input type="text" class="form-control d-inline-flex" id="groupName" name="groupName"></td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">기관주소</th>
            <td><input type="text" class="form-control d-inline-flex" id="groupAdr" name="groupAdr" >
              <button type="button" class="btn btn-secondary btn-sm">주소검색</button>
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">담당자명</th>
            <td>
              <input type="text" id="groupPhone" name="groupPhone" class="form-control d-inline-flex">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">전화번호</th>
            <td>
              <input type="text" id="groupPhone" name="groupPhone" class="form-control d-inline-flex" maxlength="11">
            </td>
          </tr>
          <tr>
            <th class="text-center align-middle bg-dark small" style="--bs-bg-opacity: .05;" scope="col">이메일</th>
            <td>
              <input type="text" id="groupPhone" name="groupPhone" class="form-control d-inline-flex">
            </td>
          </tr>

        </table>
      </div>
    </div>
    <p class="text-end">
      <button class="btn btn-primary mb-1 ms-1" onclick="addUser">등록</button>
    </p>
  </div>
</template>

<script>
export default {
  name: "OganiAdd"
}
</script>

<style scoped>

</style>