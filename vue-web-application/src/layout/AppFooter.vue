<template>
    <footer class="footer has-cards">
        <div class="container">
            <hr>
            <div class="row align-items-center justify-content-md-between">
                <div class="col-md-6">
                    <div class="copyright">
                        &copy; {{ date }}
                        <a href="https://codelabs.netlify.com" target="_blank">Quabynah Codelabs</a>.
                    </div>
                </div>
                <div class="col-md-6">
                    <ul class="nav nav-footer justify-content-end">
                        <li class="nav-item">
                            <a href="https://codelabs.netlify.com" class="nav-link" target="_blank">About Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
import firebaseapp from '@/components/firebase/firebaseinit'

export default {
    data() {
        return {
            date : new Date().getFullYear()
        }
    }
};
</script>
<style>
</style>
