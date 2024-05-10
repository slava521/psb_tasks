const nums1 = [1, 2, 3, 0, 0, 0];
const m = 3;
const nums2 = [2, 5, 6];
const n = 3;

const merge = (nums1, m, nums2, n) => {
    const temp_arr = [...nums1];
    let i = 0;
    let j = 0;
    while (i < m || j < n) {
        if (i < m && j < n) {
            if (temp_arr[i] <= nums2[j]) {
                nums1[i + j] = temp_arr[i];
                i++;
            }
            else {
                nums1[i + j] = nums2[j];
                j++;
            }
        }
        else if (i < m) {
            nums1[i + j] = temp_arr[i];
            i++;
        }
        else {
            nums1[i + j] = nums2[j];
            j++;
        }
    }
}

merge(nums1, m, nums2, n);

console.log(nums1);