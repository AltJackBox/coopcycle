package fr.polytech.info4.web.rest;

import fr.polytech.info4.repository.CooperativeRepository;
import fr.polytech.info4.service.CooperativeService;
import fr.polytech.info4.service.dto.CooperativeDTO;
import fr.polytech.info4.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.polytech.info4.domain.Cooperative}.
 */
@RestController
@RequestMapping("/api")
public class CooperativeResource {

    private final Logger log = LoggerFactory.getLogger(CooperativeResource.class);

    private static final String ENTITY_NAME = "cooperative";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CooperativeService cooperativeService;

    private final CooperativeRepository cooperativeRepository;

    public CooperativeResource(CooperativeService cooperativeService, CooperativeRepository cooperativeRepository) {
        this.cooperativeService = cooperativeService;
        this.cooperativeRepository = cooperativeRepository;
    }

    /**
     * {@code POST  /cooperatives} : Create a new cooperative.
     *
     * @param cooperativeDTO the cooperativeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cooperativeDTO, or with status {@code 400 (Bad Request)} if the cooperative has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cooperatives")
    public ResponseEntity<CooperativeDTO> createCooperative(@Valid @RequestBody CooperativeDTO cooperativeDTO) throws URISyntaxException {
        log.debug("REST request to save Cooperative : {}", cooperativeDTO);
        if (cooperativeDTO.getId() != null) {
            throw new BadRequestAlertException("A new cooperative cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CooperativeDTO result = cooperativeService.save(cooperativeDTO);
        return ResponseEntity
            .created(new URI("/api/cooperatives/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cooperatives/:id} : Updates an existing cooperative.
     *
     * @param id the id of the cooperativeDTO to save.
     * @param cooperativeDTO the cooperativeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cooperativeDTO,
     * or with status {@code 400 (Bad Request)} if the cooperativeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cooperativeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cooperatives/{id}")
    public ResponseEntity<CooperativeDTO> updateCooperative(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CooperativeDTO cooperativeDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Cooperative : {}, {}", id, cooperativeDTO);
        if (cooperativeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cooperativeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cooperativeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CooperativeDTO result = cooperativeService.save(cooperativeDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cooperativeDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cooperatives/:id} : Partial updates given fields of an existing cooperative, field will ignore if it is null
     *
     * @param id the id of the cooperativeDTO to save.
     * @param cooperativeDTO the cooperativeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cooperativeDTO,
     * or with status {@code 400 (Bad Request)} if the cooperativeDTO is not valid,
     * or with status {@code 404 (Not Found)} if the cooperativeDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the cooperativeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cooperatives/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<CooperativeDTO> partialUpdateCooperative(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CooperativeDTO cooperativeDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Cooperative partially : {}, {}", id, cooperativeDTO);
        if (cooperativeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cooperativeDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cooperativeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CooperativeDTO> result = cooperativeService.partialUpdate(cooperativeDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cooperativeDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /cooperatives} : get all the cooperatives.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cooperatives in body.
     */
    @GetMapping("/cooperatives")
    public ResponseEntity<List<CooperativeDTO>> getAllCooperatives(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("compte-is-null".equals(filter)) {
            log.debug("REST request to get all Cooperatives where compte is null");
            return new ResponseEntity<>(cooperativeService.findAllWhereCompteIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of Cooperatives");
        Page<CooperativeDTO> page = cooperativeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /cooperatives/:id} : get the "id" cooperative.
     *
     * @param id the id of the cooperativeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cooperativeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cooperatives/{id}")
    public ResponseEntity<CooperativeDTO> getCooperative(@PathVariable Long id) {
        log.debug("REST request to get Cooperative : {}", id);
        Optional<CooperativeDTO> cooperativeDTO = cooperativeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cooperativeDTO);
    }

    /**
     * {@code DELETE  /cooperatives/:id} : delete the "id" cooperative.
     *
     * @param id the id of the cooperativeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cooperatives/{id}")
    public ResponseEntity<Void> deleteCooperative(@PathVariable Long id) {
        log.debug("REST request to delete Cooperative : {}", id);
        cooperativeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
